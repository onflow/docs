import React, { useState } from 'react';
import { HomepageStartItem } from '../HomepageStartItem';
import { Button } from '../Button';
import { HomepageStartItemIcons } from '../HomepageStartItem/HomepageStartIcons';

const roadmapData = {
  link: 'https://flow.com/upgrade/crescendo/cadence-1#roadmap',
  icon: 'roadmap',
};

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

  const handleSubscribe = async (): Promise<void> => {
    setIsSubmitting(true);
    if (isValidEmail(email)) {
      // Add here your logic to handle the email subscription
      try {
        const response = await fetch(
          'https://hooks.zapier.com/hooks/catch/12044331/3pv7v1t/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
          },
        );

        if (response.ok) {
          setResponseMessage('Subscription successful!');
          setEmail('');
        } else {
          throw new Error('Failed to subscribe.');
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMsg('An error occurred.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log('Invalid email');
      setErrorMsg('Please enter a valid email address'); // Trigger some user feedback
    }
  };

  return (
    <div className="container md:p-0">
      <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
        <HomepageStartItem key={0} {...roadmapData} />
        <div className="flex flex-col gap-4 rounded-lg p-2">
          <HomepageStartItemIcons icon={'updates'} />
          <span className="text-3xl font-semibold">
            Flow Ecosystem Newsletter{' '}
          </span>
          <div className="text-primary-gray-300">
            Stay up to date with the latest changelog updates, educational
            resources, grants and announcements.
          </div>
          <input
            className="rounded-md p-4 border-0 text-primary-gray-300"
            type="text"
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
                setErrorMsg('Please enter your email');
                return;
              }
              setErrorMsg(isValidEmail(email) ? '' : 'Invalid email');
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
          {errorMsg !== '' && <div className="text-red-500">{errorMsg}</div>}
          {responseMessage !== '' && (
            <div className="text-primary-green">{responseMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}
