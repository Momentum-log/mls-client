/**
 * Smooth-scrolls an in-page section into view, offsetting for the sticky header.
 *
 * @param id - The target element's DOM id, without the leading `#`
 * @param offset - Pixels to leave above the section. Defaults to the header height.
 */
export const scrollToSection = (id: string, offset = 72): void => {
  const element = document.getElementById(id);
  if (!element) return;

  window.scrollTo({
    top: element.getBoundingClientRect().top + window.scrollY - offset,
    behavior: "smooth",
  });
};
