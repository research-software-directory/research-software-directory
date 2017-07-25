/**
 * merges non-empty values of `b` that are not in `a` with `a`
 *
 * @param {string[]} a enum1
 * @param {(string[] | null)} b
 * @returns merge of a and b
 */
const mergeEnums = (a: string[], b: string[] | null) => {
  return a.concat(b && b.filter(
    (lang: string) => lang !== '' && a.indexOf(lang) === -1
  ) || []);
};



        