function parseTypeParam(value) {
    if (typeof value === 'undefined') {
        return undefined;
    }
    const parsedType = ['home', 'personal', 'work', 'other'];
    return parsedType.includes(value) ?  value : undefined;
}

function parseIsFavouriteParam(value) {
    if (typeof value === 'undefined') {
        return undefined;
    }
    if (value === 'true') return true ;
    if (value === 'false') return false ;
    return undefined;
}


export function parseFilterParams(query) {
  const { type, isFavourite } = query;
  return {
    type: parseTypeParam(type),
      isFavourite: parseIsFavouriteParam(isFavourite),
    };
}
