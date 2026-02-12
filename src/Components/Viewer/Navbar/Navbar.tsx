import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  onOrderSampleClick?: () => void;
};

const Navbar = ({ onOrderSampleClick }: NavbarProps) => {
  const navigate = useNavigate();
  const sections = useMemo(
    () => [
      { id: "section-base", label: "Base" },
      { id: "section-base-color", label: "Base Colour" },
      { id: "section-top-color", label: "Top Colour" },
      { id: "section-top-shape", label: "Top Shape" },
      { id: "section-dimensions", label: "Dimension" },
      { id: "section-chair", label: "Chair" },
      { id: "section-summary", label: "Summary" },
    ],
    [],
  );
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const root = document.getElementById("right-ui-scroll");
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        root,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const buttonClass = (id: string) =>
    `px-2 py-1 uppercase text-xs md:text-sm lg:text-xs 2xl:text-base ${
      id === activeId ? "font-bold border-b-2 border-primary" : ""
    }`;

  return (
    <div className="flex [box-shadow:0px_1px_8px_0px_#00000029] gap-4 items-center p-2 px-3 xl:px-6 justify-center relative header-main">
      <div className="flex gap-4 justify-between items-center w-full">
        <div className="w-72">
          <div className="relative h-8 md:h-10 lg:h-6 xl:h-14 aspect-5/1">
            <a
              href="https://be-made-website.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="assets/images/header_logo.svg"
                className="w-full h-full object-contain"
                alt="logo"
              />
            </a>
          </div>
        </div>
        <div className="hidden lg:flex gap-6">
          <div className="relative">
            <div className="flex gap-2 2xl:gap-6 overflow-x-auto whitespace-nowrap px-2 py-2 lg:py-1 scroll-smooth [box-shadow:0px_1px_8px_0px_#00000029] lg:shadow-none scrollbar-width: none">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={buttonClass(section.id)}
                  onClick={() => scrollToSection(section.id)}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-72 flex justify-end">
          <div className="w-auto flex items-center justify-end gap-3 2xl:justify-start">
            <button
              type="button"
              onClick={() => navigate("/auth?mode=login")}
              className="hidden md:inline-flex items-center justify-center rounded-full border border-[var(--color-border-color)] px-3 md:px-4 py-2 text-sm lg:text-xs xl:text-base text-[var(--color-font)] hover:bg-[var(--color-grid-bg)] transition-all duration-300 ease-in-out"
            >
              Login / Register
            </button>
            <button
              type="button"
              onClick={onOrderSampleClick}
              className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-border-color)] bg-[var(--color-secondary)] text-[var(--color-font)] hover:bg-[var(color-primary)] hover:text-[var(--color-secondary)] transition-all duration-300 ease-in-out disabled:!cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent px-3 md:px-4 py-2 !bg-[var(--color-primary)] text-[var(--color-secondary)] hover:scale-95 !rounded-[99px] text-sm lg:text-xs xl:text-base disabled:hover:scale-100"
            >
              <span>Order Sample</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
