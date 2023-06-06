export const greetUser = (name: string): string => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return `Good morning, ${name}`;
  }
  if (currentHour < 18) {
    return `Good afternoon, ${name}`;
  }
  return `Good evening, ${name}`;
};
