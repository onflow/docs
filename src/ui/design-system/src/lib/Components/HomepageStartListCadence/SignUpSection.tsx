import React, { useState } from 'react';
import { HomepageStartItem } from '../HomepageStartItem';
import { Button } from '../Button';
import { HomepageStartItemIcons } from '../HomepageStartItem/HomepageStartIcons';

const roadmapData = {
  link: 'https://flow.com/upgrade/crescendo/cadence-1#roadmap',
  icon: 'roadmap',
};
const SUCCESS_MESSAGE = 'Subscription successful!';

export function SignUpSection(): React.ReactElement {
  const [email, setEmail] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const isValidEmail = (email: string): boolean => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubscribe = (): void => {
    setIsSubmitting(true);
    if (isValidEmail(email)) {
      // Add here your logic to handle the email subscription
      fetch('https://hooks.zapier.com/hooks/catch/12044331/3pv7v1t/', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => {
          if (response.status === 0) {
            // using no-cors mode, status is always 0
            setResponseMessage(SUCCESS_MESSAGE);
            setEmail('');
            setErrorMsg('');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setErrorMsg('An error occurred.');
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      setErrorMsg('Please enter a valid email address'); // Trigger some user feedback
    }
  };

  return (
    <div className="container md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <HomepageStartItem key={0} {...roadmapData} />
        <div className="flex flex-col gap-4 rounded-lg">
          <HomepageStartItemIcons icon={'updates'} />
          <span className="text-3xl font-semibold">
            Flow Ecosystem Newsletter{' '}
          </span>
          <div className="text-primary-gray-300">
            Stay up to date with the latest changelog updates, educational
            resources, grants and announcements.
          </div>

          {responseMessage !== SUCCESS_MESSAGE && (
            <>
              <input
                className="rounded-md p-4 border-0 text-primary-gray-300"
                type="text"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value.toLowerCase());
                  if (e.target.value === '') {
                    setErrorMsg('Please enter your email');
                  }
                  if (isValidEmail(email)) setErrorMsg('');
                }}
                onBlur={(e) => {
                  if (e.target.value === '') {
                    setErrorMsg('');
                    return;
                  }
                  setErrorMsg(
                    isValidEmail(email) ? '' : 'Please enter a valid email',
                  );
                }}
              />
              <Button
                onClick={handleSubscribe}
                size={'sm'}
                variant="accent"
                className="p-4 border-0"
                disabled={!isValidEmail(email)}
              >
                {isSubmitting ? 'Submitting' : 'Subscribe'}
              </Button>
            </>
          )}
          {errorMsg !== '' && (
            <div className="min-h-[30px] text-red-500">{errorMsg}</div>
          )}
          {errorMsg === '' && (
            <div
              className={`min-h-[30px] transition-opacity duration-2000 ease-out ${
                responseMessage === SUCCESS_MESSAGE
                  ? 'opacity-100'
                  : 'opacity-0'
              } align-center justify-center bg-primary-gray-400 rounded-lg text-primary-green p-4 w-full`}
            >
              {SUCCESS_MESSAGE}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
