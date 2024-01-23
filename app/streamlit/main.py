# streamlit_app.py

import streamlit as st
from app.streamlit.pages.session_state import SessionState
from app.streamlit.pages import login, home
# Streamlit session state
streamlit_state = SessionState(page="login", username=None, password=None)

# Streamlit app
def main():
    if streamlit_state.page == "login":
        login.login_page(streamlit_state)
    elif streamlit_state.page == "home":
        home.home_page()
   

if __name__ == "__main__":
    main()
