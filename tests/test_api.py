import pytest
import requests


def test_about():
    expected_response = [
        {
            "first_name": "Roei",
            "last_name": "Itzhak"
        },
        {
            "first_name": "Raziel",
            "last_name": "Otick"
        }
    ]
    response = requests.get('https://projectcostmanager.onrender.com/api/about')
    assert response.status_code == 200
    assert response.json() == expected_response


def test_about_invalid():
    expected_response = [
        {
            "first_name": "Roei",
            "last_name": "Itzhak"
        },
        {
            "first_name": "Raziel",
            "last_name": "O"
        }
    ]
    response = requests.get('https://projectcostmanager.onrender.com/api/about')
    assert response.status_code == 200
    assert response.json() != expected_response