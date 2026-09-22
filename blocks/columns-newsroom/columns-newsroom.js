/**
 * Newsroom columns: a two-column split layout. The left column holds the
 * "Latest stories" content and the right column holds "Latest press releases".
 * Each authored row is a set of side-by-side column cells.
 * @param {Element} block The columns-newsroom block element
 */
export default function decorate(block) {
  const cols = [...(block.firstElementChild?.children || [])];
  block.classList.add(`columns-newsroom-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      col.classList.add('columns-newsroom-col');
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-newsroom-img-col');
        }
      }
    });
  });
}
