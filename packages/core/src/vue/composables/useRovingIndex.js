import { ref, watch, nextTick } from "vue";

export default function useRovingIndex(itemsRef, activeIdRef = null) {
  const tabAnchors = ref([]);
  const focusedIndex = ref(-1);

  // Helper to extract an identifier from an item in a flexible way
  const getId = (item) => {
    if (item === undefined || item === null) return undefined;
    if (typeof item === "string" || typeof item === "number") return item;
    // Common id field variations
    return item.id ?? item.key ?? item._id ?? item.name;
  };

  function updateInitialFocus() {
    const items = itemsRef && itemsRef.value ? itemsRef.value : [];
    const activeId =
      activeIdRef && typeof activeIdRef.value !== "undefined"
        ? activeIdRef.value
        : undefined;
    const idx =
      typeof activeId !== "undefined"
        ? items.findIndex((item) => {
            const id = getId(item);
            // loose equality on purpose to match numbers/strings
            return typeof id !== "undefined" ? id == activeId : false;
          })
        : -1;
    focusedIndex.value = idx >= 0 ? idx : items.length ? 0 : -1;
  }

  // Safely retrieve an <a> element from the stored ref which may be:
  // - a DOM Element (li)
  // - a DOM Element that is the anchor itself
  // - a Vue component proxy with $el
  function getAnchorElementFromRef(refItem) {
    if (!refItem) return null;

    // If it's a DOM Element
    try {
      if (refItem instanceof Element) {
        // If the element itself is an anchor, return it, otherwise query inside
        return refItem.tagName && refItem.tagName.toLowerCase() === "a"
          ? refItem
          : refItem.querySelector
            ? refItem.querySelector("a")
            : null;
      }
    } catch (e) {
      // Accessing window.Element may throw in some environments; fallthrough to other checks
    }

    // If it's a Vue component proxy, try to use its $el or el
    if (typeof refItem === "object") {
      const el = refItem.$el || refItem.el;
      if (el) {
        if (el instanceof Element) {
          return el.tagName && el.tagName.toLowerCase() === "a"
            ? el
            : el.querySelector
              ? el.querySelector("a")
              : null;
        }
        // If $el is a string or something unexpected, ignore
      }
    }

    return null;
  }

  watch(
    [
      () => (itemsRef && itemsRef.value ? itemsRef.value : []),
      () =>
        activeIdRef && typeof activeIdRef.value !== "undefined"
          ? activeIdRef.value
          : undefined,
    ],
    async () => {
      updateInitialFocus();
      await nextTick();
      if (focusedIndex.value >= 0 && tabAnchors.value[focusedIndex.value]) {
        const anchor = getAnchorElementFromRef(
          tabAnchors.value[focusedIndex.value],
        );
        if (anchor) anchor.setAttribute("tabindex", "0");
      }
    },
    { immediate: true },
  );

  function focusAt(index) {
    const items = itemsRef && itemsRef.value ? itemsRef.value : [];
    if (!items.length) return;
    const n = items.length;
    const newIndex = (index + n) % n;
    focusedIndex.value = newIndex;
    nextTick(() => {
      const refItem = tabAnchors.value[newIndex];
      const a = getAnchorElementFromRef(refItem);
      if (a) a.focus();
    });
  }

  function onKeydown(event) {
    const items = itemsRef && itemsRef.value ? itemsRef.value : [];
    if (!items.length) return;
    const key = event.key;
    if (["ArrowDown", "ArrowRight"].includes(key)) {
      event.preventDefault();
      focusAt(focusedIndex.value + 1);
    } else if (["ArrowUp", "ArrowLeft"].includes(key)) {
      event.preventDefault();
      focusAt(focusedIndex.value - 1);
    } else if (key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (key === "End") {
      event.preventDefault();
      focusAt(items.length - 1);
    }
  }

  // Initial calculation
  updateInitialFocus();

  return {
    tabAnchors,
    focusedIndex,
    onKeydown,
    focusAt,
    updateInitialFocus,
  };
}
