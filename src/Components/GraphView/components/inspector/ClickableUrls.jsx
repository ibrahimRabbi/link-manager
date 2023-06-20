import React from 'react';

// credits to https://www.regextester.com/96504, modified though
const URL_REGEX =
  // eslint-disable-next-line max-len
  /(?:https?|s?ftp|bolt):\/\/(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()/[\]{};:''.,<>?«»“”‘’]))?/gi;

export default function ClickableUrls({ text = '', WrappingTag = 'span' }) {
  const urls = text.match(URL_REGEX) || [];
  return (
    <WrappingTag>
      {text.split(URL_REGEX).map((text, index) => {
        /* since we never move these components this key should be fine */
        return (
          <React.Fragment key={index}>
            {text}
            {urls[index] && (
              <a href={urls[index]} target="_blank" rel="noreferrer">
                {urls[index]}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </WrappingTag>
  );
}
