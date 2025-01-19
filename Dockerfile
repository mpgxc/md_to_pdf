FROM python:3.12-slim

RUN apt-get update && apt-get install -y \
    wkhtmltopdf \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app

RUN apt install wkhtmltopdf

RUN pip install --no-cache-dir flask markdown pdfkit gunicorn

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
