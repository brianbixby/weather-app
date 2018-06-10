export default (state={}, action) => {
  let { type, payload } = action;

  switch(type) {
    case 'WEATHER_FETCH':
      return payload;
    default:
      return state;
  }
};