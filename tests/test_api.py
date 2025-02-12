import pytest
import requests
from unittest import mock

BASE_URL = 'https://projectcostmanager.onrender.com/api'
# BASE_URL = 'https://awful-micaela-roei922-d3395819.koyeb.app'


@mock.patch("requests.post")
def test_add_cost_item(mock_post):
    payload = {
        "description": "Groceries",
        "category": "food",
        "userid": 1,
        "sum": 100,
        "year": 2023,
        "month": 10,
        "day": 15,
        "time": "12:00:00"
    }
    mock_response = mock.Mock()
    mock_response.status_code = 201
    mock_response.json.return_value = {"description": "Groceries"}
    mock_post.return_value = mock_response

    response = requests.post(f'{BASE_URL}/add', json=payload)
    assert response.status_code == 201
    assert response.json()["description"] == "Groceries"


@pytest.mark.parametrize("payload, expected, code", [
    ({"description": "Groceries", "category": "food", "userid": 9999, "sum": 1}, "User not found.", 404),
    ({"description": "Groceries", "category": "", "userid": 123123, "sum": 1}, "Category is required.", 400),
    ({"description": "", "category": "food", "userid": 123123, "sum": 1}, "Description is required.", 400),
    ({"description": "Groceries", "category": "invalid_category", "userid": 123123, "sum": 1}, "Invalid category", 400),
    ({"description": "Groceries", "category": "food", "userid": 123123, "sum": -1}, "less than minimum allowed value", 400),
    ({"description": "Groceries", "category": "food", "userid": 123123, "sum": 1, "year": 1800}, "Invalid year", 400),
    ({"description": "Groceries", "category": "food", "userid": 123123, "sum": 1, "month": 13}, "Invalid month", 400),
    ({"description": "Groceries", "category": "food", "userid": 123123, "sum": 1, "day": 32}, "Invalid day", 400),
    ({"description": "Groceries", "category": "food", "userid": 123123, "sum": 1, "time": "25:00:00"}, "Invalid time", 400)
])
def test_add_cost_item_invalid_data(payload, expected, code):
    response = requests.post(f'{BASE_URL}/add', json=payload)
    assert response.status_code == code
    assert expected in response.json()["error"]


def test_get_user_details():
    user_id = 123123
    response = requests.get(f'{BASE_URL}/users/{user_id}')
    assert response.status_code == 200
    assert "first_name" in response.json()


def test_get_user_details_invalid_user():
    user_id = 9999
    response = requests.get(f'{BASE_URL}/users/{user_id}')
    assert response.status_code == 404
    assert response.json()["error"] == "User not found."


def test_about():
    expected_response = [
        {"first_name": "Raziel", "last_name": "Otick"},
        {"first_name": "Roei", "last_name": "Itzhak"}
    ]
    response = requests.get(f'{BASE_URL}/about')
    assert response.status_code == 200
    assert response.json() == expected_response


def test_about_invalid():
    expected_response = [
        {"first_name": "Raziel", "last_name": "Otck"},
        {"first_name": "Roei", "last_name": "Itzhak"}
    ]
    response = requests.get(f'{BASE_URL}/about')
    assert response.status_code == 200
    assert response.json() != expected_response


@mock.patch("requests.get")
def test_get_monthly_report(mock_get):
    params = {
        "id": 123123,
        "year": 2023,
        "month": 10
    }
    mock_response = mock.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "userid": 123123,
        "year": 2023,
        "month": 10,
        "costs": [
            {"food": [{"sum": 100, "description": "Groceries", "day": 15}]},
            {"health": []},
            {"housing": []},
            {"sport": []},
            {"education": []}
        ]
    }
    mock_get.return_value = mock_response

    response = requests.get(f'{BASE_URL}/report', params=params)
    assert response.status_code == 200
    assert "costs" in response.json()


@pytest.mark.parametrize("id, year, month, expected, code", [
    (9999, 2023, 10, "User not found", 404),
    (123123, 2023, -10, "month must be between 1 and 12.", 400),
    (123123, -2023, 10, "year must be between 1900 and the current year.", 400),
    (None, 2023, 10, "id is required.", 400),
    (123123, None, 10, "year is required.", 400),
    (123123, 2023, None, "month is required.", 400),
    ("abc", 2023, 10, "User ID must be a number.", 400),
    (123123, "abc", 10, "year must be a valid number.", 400),
    (123123, 2023, "abc", "month must be a valid number.", 400),
    (123123, 1800, 10, "year must be between 1900 and the current year.", 400),
    (123123, 2023, 13, "month must be between 1 and 12.", 400)
])
def test_get_monthly_report_invalid_param(id, year, month, expected, code):
    params = {
        "id": id,
        "year": year,
        "month": month
    }
    response = requests.get(f'{BASE_URL}/report', params=params)
    assert response.status_code == code
    assert expected in response.json()["error"]
