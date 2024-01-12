export default function NavLogo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.25em",
        fontSize: "32px",
      }}
    >
      {/* TODO: figure out how to size Logo and use that here instead */}
      <img
        src="/ajel2.svg"
        style={{ height: "calc(var(--nextra-navbar-height) - 35px)" }}
        alt="ajel logo"
      />
      ajel
    </div>
  );
}
