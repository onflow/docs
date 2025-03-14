---
title: Build a Fully-Onchain Image Gallery
description: Learn how to store images up to approximately 32kb onchain, on Flow EVM, easily - free with the Flow wallet, or sub-cent with any other wallet.
sidebar_position: 5
keywords: [Flow, EVM, Flow EVM, storage, Solidity, possible, store, image, jpg, jpeg, composability]
---

# Build a Fully-Onchain Image Gallery

:::info

The [FlowtoBooth] tutorial series teaches you how to build a **fun benchmark app** and provides inspiration for the greater scope of possibilities building on Flow thanks to gas being so much less expensive.

It is **not a production best-practice**.  While everything in these tutorials works, you'll run into the following problems at production scale:

* RPC Providers will likely rate-limit you for reading this much data at once
* NFT marketplaces may not display the images, likely due to the above
* 256*256 images are huge by blockchain data standards, but too small for modern devices

:::

If you search for resources on how to store images of any significant size onchain, you'll be told it's either prohibitively expensive or even completely impossible.  The reason for this is two-fold - first the size limit for data on transactions is about 40kb.  Second, saving 40kb takes almost all of the 30 million gas limit on most blockchains.

The former constraint is immutable (though many chains are slowly increasing this limit), which limits the app to images about 256*256 pixels in size.  The latter is heavily dependent on which chain you choose.

At current gas prices on most chains, using all 30 million gas in a block costs **several dollars** - or potentially **thousands** on ETH mainnet.  At current prices on Flow, spending 30 million gas costs **less than a penny**, usually 1 or 2 tenths of a cent.

Much more computation is available at prices you or your users will be willing to pay for regular interactions.  Including, but not limited to:

* Airdropping hundreds of NFTs with one transaction, for pennies
* Generation of large mazes
* Generating large amounts of random numbers (with free [native VRF])
* Extensive string manipulation onchain
* Simple game AI logic

In this tutorial, we'll build a smart contract that can store and retrieve images onchain.  We'll also build a simple frontend to interact with the contract on Flow and another chain.

## Objectives

After completing this guide, you'll be able to:

* Construct a composable onchain image gallery that can be used permissionlessly by onchain apps and other contracts to store and retrieve images
* Build an onchain app that can interact with this contract to save and display images
* Compare the price of spending 30 million gas on Flow with the price on other chains

## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js].  You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework.  You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks.

### Solidity

You don't need to be an expert, but you should be comfortable writing code in [Solidity].  You can use [Hardhat], [Foundry], or even [Remix].  

## Build an Image Gallery Contract

Start a new smart contract project in the toolchain of your choice and install the [OpenZeppelin] contracts.

In your project, stub out a new contract for your image gallery that inherits from the [Ownable] contract:

```solidity
// ImageGallery.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImageGallery is Ownable {
    constructor(address _owner) Ownable(_owner) {}
}
```

We're passing the original owner of the contract as an argument in the constructor to give greater flexibility for ownership when this contract is deployed.

### Set Up Storage for Images

We'll store the images in a a simple `struct` that holds the image as a `base64` encoded `string`and also contains a `string` for the description. Doing so allows the image to be directly used in html and makes it easier to test the contract directly with a block explorer, but has the downside of making the images 33% bigger.  Another format would be more efficient.

These will be held in array:

```solidity
struct Image {
    string description;
    string base64EncodedImage;
}

Image[] public images;
```

### Construct Functions to Add and Delete Images

Next, add a function that accepts a `_description` and `_base64EncodedImage` and adds them to the array.

```solidity
function addImage(
    string memory _description,
    string memory _base64EncodedImage
) public onlyOwner {
    images.push(Image(_description, _base64EncodedImage));
}
```

Then, add one to delete the image at a given index:

```solidity
function deleteImage(uint256 index) public onlyOwner {
    if (index >= images.length) {
        revert ImageIndexOutOfBounds(index, images.length);
    }
    for (uint256 i = index; i < images.length - 1; i++) {
        images[i] = images[i + 1];
    }
    images.pop();
}
```

:::warning

If the array gets big enough that calling `deleteImage` takes more than 30 million gas, it will brick this function.  A safer and more gas-efficient method is to use a `mapping` with a counter as the index, and handling for the case where an index is empty.

We're doing it this way to provide a way to delete accidentally uploaded images without making things too complex.

:::

### Retrieval Functions

Finally, add functions to get one image, get all of the images, and get the number of images in the collection.

```solidity
function getImages() public view returns (Image[] memory) {
    return images;
}

function getImage(uint256 index) public view returns (Image memory) {
    if (index >= images.length) {
        revert ImageIndexOutOfBounds(index, images.length);
    }
    return images[index];
}

function getImageCount() public view returns (uint256) {
    return images.length;
}
```

### Final Contract

After completing the above, you'll end up with a contract similar to:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ImageGallery is Ownable {
    struct Image {
        string description;
        string base64EncodedImage;
    }

    Image[] public images;

    error ImageIndexOutOfBounds(uint256 index, uint256 length);

    constructor(address _owner) Ownable(_owner) {}

    function addImage(
        string memory _description,
        string memory _base64EncodedImage
    ) public onlyOwner {
        images.push(Image(_description, _base64EncodedImage));
    }

    function deleteImage(uint256 index) public onlyOwner {
        if (index >= images.length) {
            revert ImageIndexOutOfBounds(index, images.length);
        }
        for (uint256 i = index; i < images.length - 1; i++) {
            images[i] = images[i + 1];
        }
        images.pop();
    }

    function getImages() public view returns (Image[] memory) {
        return images;
    }

    function getImage(uint256 index) public view returns (Image memory) {
        if (index >= images.length) {
            revert ImageIndexOutOfBounds(index, images.length);
        }
        return images[index];
    }

    function getImageCount() public view returns (uint256) {
        return images.length;
    }
}

```

### Create a Factory

The image gallery contract you've just constructed is intended to be a utility for other contracts and apps to use freely.  You don't want just one gallery for everyone, you need to give the ability for any app or contract to create and deploy private galleries freely.

Build a factory to deploy image galleries:

```solidity
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ImageGallery.sol";

contract ImageGalleryFactory {
    event ImageGalleryCreated(address indexed owner, address gallery);

    function createImageGallery(address _owner) public {
        ImageGallery gallery = new ImageGallery(_owner);
        emit ImageGalleryCreated(_owner, address(gallery));
    }
}
```

### Tracking Factories

Some app designs may need multiple galleries for each user.  For example, you might want to be able to give users the ability to collect images in separate galleries for separate topics, dates, or events, similar to how many photo apps work on smartphones.

To facilitate this feature, update your contract to keep track of which galleries have been created by which users.  You'll end up with:

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ImageGallery.sol";

contract ImageGalleryFactory {
    event ImageGalleryCreated(address indexed owner, address gallery);

    mapping(address => address[]) userToGalleries;

    function createImageGallery(address _owner) public {
        ImageGallery gallery = new ImageGallery(_owner);
        emit ImageGalleryCreated(_owner, address(gallery));
        userToGalleries[_owner].push(address(gallery));
    }

    function getGalleries(
        address _owner
    ) public view returns (address[] memory) {
        return userToGalleries[_owner];
    }
}
```

### Testing

Write appropriate unit tests, then deploy the factory on Flow Testnet.  Navigate to [evm-testnet.flowscan.io]

### The Name of A Minor Section in Sentence Case

Generally, avoid going with smaller sub-sections than H3/###

## Conclusion

In this tutorial, you ...

Now that you have completed the tutorial, you should be able to:

* Copy/paste the Objectives from above here.


(OPTIONAL) Now that you've completed this tutorial, you're ready to...

<!-- Relative links, will not render on page -->
[FlowtoBooth]: https://flowtobooth.vercel.app/
[Cadence]: https://cadence-lang.org/docs
[Next.js]: https://nextjs.org/docs/app/getting-started/installation
[Solidity]: https://soliditylang.org/
[Hardhat]: ../../evm/guides/hardhat.md
[Foundry]: ../../evm/guides/foundry.md
[Remix]: ../../evm/guides/remix.md
[native VRF]: ../../evm/guides/vrf.md
[OpenZeppelin]: https://www.openzeppelin.com/
[Ownable]: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol
[evm-testnet.flowscan.io]: 