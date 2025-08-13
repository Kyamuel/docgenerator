# syntax=docker/dockerfile:1
FROM python:3.11-slim
WORKDIR /app
COPY apps/math/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY apps/math ./
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]