module.exports.getPaginatedResult = (array, limit = 25, offset = 0) => {
  limit = Number(limit)
  offset = Number(offset)
  try {
    return array.slice(offset, offset + limit)
  } catch (error) {
    console.log('Error when paginating records: ', error)
    return []
  }
}
