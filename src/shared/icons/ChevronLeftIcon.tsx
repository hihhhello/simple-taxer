type ChevronLeftIconProps = JSX.IntrinsicElements['svg'];

export const ChevronLeftIcon = ({ ...svgIconProps }: ChevronLeftIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      {...svgIconProps}
    >
      <path
        d="M15 6.5L9 12.5L15 18.5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
