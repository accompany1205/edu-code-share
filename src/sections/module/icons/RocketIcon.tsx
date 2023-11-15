interface RocketIconProps {
  width?: number;
  height?: number;
}

const RocketIcon = ({ width, height }: RocketIconProps) => {
  return (
    <svg
      width={width ?? 53}
      height={height ?? 57}
      viewBox="0 0 53 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.6375 23.6701C41.4669 21.335 41.0531 17.9277 38.718 16.0983C36.3829 14.2689 32.9755 14.6826 31.1461 17.0178C29.3167 19.3529 29.7305 22.7602 32.0656 24.5896C34.4008 26.419 37.8081 26.0053 39.6375 23.6701ZM14.8005 29.0489C15.6817 26.656 16.8169 23.9826 18.1765 21.4164L14.2229 21.1282L9.26684 27.4542L14.8005 29.0489ZM50.3597 1.23837C50.3597 1.23837 57.6477 13.7995 42.6798 32.9051L44.8141 39.4075C45.3875 41.1242 45.0403 43.0105 43.9427 44.4115L34.0805 57L26.7925 44.4388L14.0554 34.4602L0.11502 30.3904L9.97718 17.802C11.0915 16.3797 12.8231 15.6123 14.6273 15.7582L21.4514 16.2741C36.4193 -2.83143 50.3597 1.23837 50.3597 1.23837ZM46.4348 6.24827C46.4348 6.24827 36.7068 5.54713 25.6971 19.6003C21.9551 24.3767 19.5045 31.8776 19.5045 31.8776L27.9958 38.53C27.9958 38.53 34.6922 34.3553 38.4342 29.5789C49.4439 15.5257 46.4348 6.24827 46.4348 6.24827ZM34.7409 47.4114L39.697 41.0853L38.4542 37.3369C36.3046 39.2499 33.964 41.0132 31.8516 42.4414L34.7409 47.4114Z"
        fill="url(#paint0_linear_81411_42960)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_81411_42960"
          x1="50.3597"
          y1="1.23837"
          x2="17.0978"
          y2="43.6952"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7A16C9" />
          <stop offset="1" stopColor="#F618D3" stopOpacity="0.71" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default RocketIcon;
