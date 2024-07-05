export const uniqueIdGenerator = () => {
    let uniqueId = "id" + Math.random().toString(16).slice(2)

    return uniqueId
};