import { ref, watch, nextTick } from 'vue'

export default function useRovingIndex(itemsRef, activeIdRef = null) {
  const tabAnchors = ref([])
  const focusedIndex = ref(0)

  function updateInitialFocus() {
    const items = itemsRef && itemsRef.value ? itemsRef.value : []
    const idx = activeIdRef && activeIdRef.value
      ? items.findIndex(item => item.id === activeIdRef.value)
      : -1
    focusedIndex.value = idx >= 0 ? idx : (items.length ? 0 : -1)
  }

  watch([itemsRef, activeIdRef], async () => {
    updateInitialFocus()
    await nextTick()
    if (focusedIndex.value >= 0 && tabAnchors.value[focusedIndex.value]) {
      const el = tabAnchors.value[focusedIndex.value].querySelector('a')
      if (el) el.setAttribute('tabindex', '0')
    }
  }, { immediate: true })

  function focusAt(index) {
    const items = itemsRef && itemsRef.value ? itemsRef.value : []
    if (!items.length) return
    const n = items.length
    const newIndex = (index + n) % n
    focusedIndex.value = newIndex
    nextTick(() => {
      const li = tabAnchors.value[newIndex]
      if (li) {
        const a = li.querySelector('a')
        if (a) a.focus()
      }
    })
  }

  function onKeydown(event) {
    const items = itemsRef && itemsRef.value ? itemsRef.value : []
    if (!items.length) return
    const key = event.key
    if (['ArrowDown', 'ArrowRight'].includes(key)) {
      event.preventDefault()
      focusAt(focusedIndex.value + 1)
    } else if (['ArrowUp', 'ArrowLeft'].includes(key)) {
      event.preventDefault()
      focusAt(focusedIndex.value - 1)
    } else if (key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (key === 'End') {
      event.preventDefault()
      focusAt(items.length - 1)
    }
  }

  // Initial calculation
  updateInitialFocus()

  return {
    tabAnchors,
    focusedIndex,
    onKeydown,
    focusAt,
    updateInitialFocus
  }
}
