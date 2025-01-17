import React from "react";

function CountIcon(props) {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 256 173"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="currentColor" // Use currentColor to inherit the text color
      {...props}
    >
      <title>shopping cart</title>
      <path
        d="M128.253,56.864c15.186,0,27.432-12.247,27.432-27.432S143.536,2,128.253,2
          c-15.186,0-27.432,12.247-27.432,27.432C100.918,44.716,113.165,56.864,128.253,56.864z M64.571,136.32h-49.28
          c-15.969,0-16.851-24.395,0.294-24.395H58.3l24.493-36.054c7.25-9.895,15.48-14.598,27.138-14.598h36.544
          c11.659,0,19.888,4.311,27.138,14.598l24.591,36.054h43.01c17.243,0,16.165,24.395,0.588,24.395h-49.28
          c-3.919,0-8.622-1.372-11.365-5.584l-18.811-26.844l-0.098,67.209H94.844l-0.098-67.209l-18.811,26.844
          C73.192,134.85,68.49,136.32,64.571,136.32z"
      />
      <circle cx="207.5" cy="88.5" r="13.5" />
      <circle cx="35.5" cy="88.5" r="13.5" />
      <circle cx="240.5" cy="88.5" r="13.5" />
      <circle cx="224.5" cy="57.5" r="13.5" />
    </svg>
  );
}

export default CountIcon;
