export const splitNames = (name: string) => {
  /* splits name into first & last name, returns string[2]; */
  const nameParts = name.split(' ');
  return [nameParts[0], nameParts[nameParts.length - 1]];
};
