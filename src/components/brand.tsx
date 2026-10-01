import Image from "next/image";

export function Duck({
  className = "",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      className={className}
      src="/brand/qblogo.svg"
      alt=""
      width={size}
      height={Math.round((size * 384) / 432)}
      loading="eager"
      unoptimized
    />
  );
}

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M3 12h17m-7-7 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Precompute three compound paths instead of animating hundreds of SVG cells.
const waterPaths = (() => {
  const paths = ["", "", ""];
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 42; x++) {
      const radius = Math.sqrt(((x - 20.5) / 20) ** 2 + ((y - 10.5) / 9) ** 2);
      const band =
        radius > 0.9 && radius < 1.02
          ? 0
          : radius > 0.66 && radius < 0.78
            ? 1
            : radius > 0.4 && radius < 0.54
              ? 2
              : -1;
      if (band !== -1) paths[band] += `M${x * 12} ${y * 12}h12v12h-12Z`;
    }
  }
  return paths;
})();

export function PixelWater({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      className={`pixel-water ${className}`}
      viewBox="0 0 504 264"
      aria-hidden="true"
      shapeRendering="crispEdges"
    >
      {[0, 1, 2].map((band) => (
        <g className={`water-band water-band-${band}`} key={band}>
          <path d={waterPaths[band]} />
        </g>
      ))}
    </svg>
  );
}
