export const Axis = {
  X: "X",
  Y: "Y",
  Z: "Z",
};

export function indexToAxis(i) {
  switch(i) {
    case 0:
      return Axis.X;
    case 1:
      return Axis.Y;
    case 2:
      return Axis.Z;
    default:
      return null;
  }
}
