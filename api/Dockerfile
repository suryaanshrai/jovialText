FROM python:3.12

WORKDIR /app

COPY pyproject.toml .
COPY poetry.lock .
RUN pip install poetry
RUN poetry config virtualenvs.create false && poetry lock && poetry install --no-root

COPY app .
RUN pip install gunicorn

CMD ["gunicorn", "--reload", "--bind", "localhost:8000", "app.wsgi:application"]
