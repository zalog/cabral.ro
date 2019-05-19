export default (html) => {
  if (typeof window === 'undefined') return;

  let textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};