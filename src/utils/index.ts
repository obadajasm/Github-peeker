 const removeDuplicationUsingID = <T extends { id: number }>(firstList: T[], secList: T[]) => {
    const first = [...firstList]
    const sec = [...secList];
    for (const item of first) {
        const idx = sec.findIndex(e => e.id === item.id);
        if (idx !== -1) {
            sec.splice(idx, 1);
        }
    }

    return [first, sec];
}


export const paginationHelper = (type: 'users' | 'repos', state: any, payload: any) => {
    let oldItems = (state[type])?.items?.slice() ?? [];
    let newItems = [...(payload?.items ?? [])];
  
    [oldItems, newItems] = removeDuplicationUsingID(oldItems, newItems);
  
  
    return {
      total_count: (state[type]?.total_count ?? 0) + payload.total_count,
      items: [...oldItems, ...newItems]
    }
  }