'use client';

import { useEffect } from 'react';

// 👇 Thêm đoạn này để TypeScript không báo lỗi
declare global {
  interface Window {
    FB: any;
  }
}

export default function FacebookPagePlugin() {
  useEffect(() => {
    if (window.FB) {
      window.FB.XFBML.parse(); // Nếu SDK đã load thì parse lại
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.src =
        'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v17.0';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-page"
        data-href="https://web.facebook.com/groups/410941336012135"
        data-tabs="timeline"
        data-width="368px"
        data-height="118px"
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://web.facebook.com/groups/410941336012135"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://web.facebook.com/groups/410941336012135">Hoàng Kim</a>
        </blockquote>
      </div>
    </>
  );
}
