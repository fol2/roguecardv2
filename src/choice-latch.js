// One-shot interaction guard for delayed choice animations.
export function createChoiceLatch() {
  let locked = false;
  return {
    claim() {
      if (locked) return false;
      locked = true;
      return true;
    },
    get locked() { return locked; },
  };
}
