import streamlit as st
from .session_state import SessionState

def login_page(session_state: SessionState):
    st.set_page_config(page_title="Login")
    st.title("Login Page")
    session_state.username = st.text_input("Username")
    session_state.password = st.text_input("Password", type="password")
    if st.button("Login"):
        if authenticate_user(session_state.username, session_state.password):
            session_state.page = "home"

def authenticate_user(username, password):
    # Implement your authentication logic here
    # For simplicity, using hardcoded credentials
    return username == "user1" and password == "password1"
