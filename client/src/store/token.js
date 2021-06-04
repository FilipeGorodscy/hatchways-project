const GOT_TOKEN = "GOT_TOKEN";

export const gotCsrfToken = (csrfToken) => {
  return {
    type: GOT_TOKEN,
    csrfToken,
  };
};

const reducer = (state = null, action) => {
  switch (action.type) {
    case GOT_TOKEN:
      return action.csrfToken;
    default:
      return state;
  }
};

export default reducer;
