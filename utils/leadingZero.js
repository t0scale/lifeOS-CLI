// adds leading zero that is
// needed for date entries
export default function leadingZero(value) {
  if (value < 10) {
    return (value = `0${value}`);
  }
  return value;
}