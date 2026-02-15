import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  onOrderSampleClick?: () => void;
};

const NAV_SECTIONS = [
  { id: "section-base", label: "Base" },
  { id: "section-base-color", label: "Base Colour" },
  { id: "section-top-color", label: "Top Colour" },
  { id: "section-top-shape", label: "Top Shape" },
  { id: "section-dimensions", label: "Dimension" },
  { id: "section-chair", label: "Chair" },
  { id: "section-summary", label: "Summary" },
] as const;

const ANCHOR_OFFSET = 64;

const Navbar = ({ onOrderSampleClick }: NavbarProps) => {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(NAV_SECTIONS[0].id);

  // Keep only visible entries (no arrays, no sorting churn)
  const visibleRef = useRef<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    const root = document.getElementById("right-ui-scroll");
    if (!root) return;

    const updateActive = () => {
      const anchorY = (root.getBoundingClientRect().top ?? 0) + ANCHOR_OFFSET;

      let closestId: string | null = null;
      let minDistance = Infinity;

      visibleRef.current.forEach((rect, id) => {
        const dist = Math.abs(rect.top - anchorY);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = id;
        }
      });

      if (closestId && closestId !== activeId) {
        setActiveId(closestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) {
            visibleRef.current.set(id, entry.boundingClientRect);
          } else {
            visibleRef.current.delete(id);
          }
        });

        updateActive();
      },
      {
        root,
        rootMargin: `-${ANCHOR_OFFSET}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      visibleRef.current.clear();
    };
  }, [activeId]);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const navButtonClass = useCallback(
    (id: string) =>
      `px-2 py-1 uppercase text-xs md:text-sm lg:text-xs 2xl:text-base transition-all ${
        id === activeId ? "font-bold border-b-2 border-primary" : ""
      }`,
    [activeId],
  );

  return (
    <header className="flex gap-4 items-center p-2 px-3 xl:px-6 justify-center relative header-main [box-shadow:0px_1px_8px_0px_#00000029]">
      <div className="flex items-center w-full justify-between">
        {/* Logo */}
        <div className="w-72">
          <a
            href="https://be-made-website.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="block h-8 md:h-10 lg:h-6 xl:h-14 aspect-[5/1]"
          >
            <img
              src="assets/images/header_logo.svg"
              alt="logo"
              className="w-full h-full object-contain"
            />
          </a>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex gap-6">
          <div className="flex gap-2 2xl:gap-6 overflow-x-auto whitespace-nowrap px-2 py-2 lg:py-1 scrollbar-width-none">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={navButtonClass(id)}
                onClick={() => scrollToSection(id)}
                aria-current={id === activeId ? "page" : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Actions */}
        <div className="w-72 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/auth?mode=login")}
            className="hidden md:inline-flex items-center justify-center rounded-full border border-[var(--color-border-color)] px-3 md:px-4 py-2 text-sm lg:text-xs xl:text-base hover:bg-[var(--color-grid-bg)] transition"
          >
            Login / Register
          </button>

          <button
            type="button"
            onClick={onOrderSampleClick}
            className="flex items-center gap-2 rounded-full px-3 md:px-4 py-2 text-sm lg:text-xs xl:text-base bg-[var(--color-primary)] text-[var(--color-secondary)] hover:scale-95 transition"
          >
            Order Sample
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
