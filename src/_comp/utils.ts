
export function nice_date(year:number, month:number, day:number):string{
    // Get date as a localised string
    // WARN Safari doesn't support `dateStyle`
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}
