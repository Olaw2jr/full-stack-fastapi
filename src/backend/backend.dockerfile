FROM python:3.13.0a6-slim AS build-stage

LABEL maintainer="Oscar Olotu <oscar@chai.co.tz>"

COPY ./app/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY ./app/start.sh /start.sh
RUN chmod +x /start.sh

COPY ./app/gunicorn_conf.py /gunicorn_conf.py

COPY ./app/start-reload.sh /start-reload.sh
RUN chmod +x /start-reload.sh

# COPY ./app /app
WORKDIR /app/

ENV PYTHONPATH=/app

EXPOSE 80

# Run the start script, it will check for an /app/prestart.sh script (e.g. for migrations)
# And then will start Gunicorn with Uvicorn
CMD ["/start.sh"]


FROM build-stage

# Install prerequisites
RUN apt update \
  && apt -y install --no-install-recommends \
    curl \
    build-essential \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

WORKDIR /app/

# Copy poetry.lock* in case it doesn't exist in the repo
COPY ./app/pyproject.toml ./app/poetry.lock* /app/

# Allow installing dev dependencies to run tests
ARG INSTALL_DEV=false
RUN bash -c "if [ $INSTALL_DEV == 'true' ] ; then poetry install --no-root ; else poetry install --no-root --only main ; fi"

COPY ./app /app
ENV PYTHONPATH=/app
