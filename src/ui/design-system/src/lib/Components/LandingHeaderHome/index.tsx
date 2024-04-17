import React, { type ReactNode } from 'react';
import LandingImage from '../../../../images/misc/landing-home.png';
import LandingImage2x from '../../../../images/misc/landing-home@2x.png';
import { ButtonLink } from '../Button';

export interface LandingHeaderHomeProps {
  description: string | ReactNode;
  discordUrl: string;

  /**
   * The URL to the page on github that allows editing this page's content
   */
  githubUrl: string;
  tag: string;
  title: string;
}

export function LandingHeaderHome({
  description,
  tag,
  title,
}: LandingHeaderHomeProps): JSX.Element {
  return (
    <div className="container flex flex-col items-center pt-4 pb-10 md:flex-row">
      <div className="mt-8 flex max-w-full flex-1 basis-1/2 flex-col items-start pb-4 pr-4">
        <h1 className="text mb-6 max-w-full overflow-hidden text-ellipsis !text-4xl md:!text-7xl ">
          {title}
        </h1>
        <div className="mb-4 max-w-[400px] text-md text-primary-gray-400 dark:text-primary-gray-50">
          {description}
        </div>
        <div className="mb-4">
          <ButtonLink size={'sm'} variant="accent" href={'/build/flow'} className={"hover:no-underline hover:opacity-80"}>
            Read Docs
          </ButtonLink>
        </div>
      </div>
      <div className="pr-0 md:ml-auto md:mr-14 md:pl-4">
        <img
          src={LandingImage}
          srcSet={`${LandingImage}, ${LandingImage2x} 2x`}
          alt=""
          className="max-h-[195px] object-cover md:max-h-[380px]"
        />
      </div>
    </div>
  );
}
