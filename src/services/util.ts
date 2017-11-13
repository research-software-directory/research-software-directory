export const splitNames = (name: string) => {
  /* splits name into first & last name, returns string[2]; */

  if (name.indexOf(',') !== -1) {
    const parts = name.split(',');
    return [parts[1], parts[0]];
  }

  const nameParts = name.split(' ');
  return [nameParts[0], nameParts[nameParts.length - 1]];
};
