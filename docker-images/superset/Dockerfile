
# FROM rteja91/superset:2.26.2022
# FROM apache/superset:2.0.0
#
FROM prnth22/superset:2.0.0
#COPY config/superset_config.py /etc/superset/
COPY others/superset_config.py /app/

ENV SUPERSET_CONFIG_PATH=/app/superset_config.py

# RUN export SUPERSET_CONFIG_PATH=/app/superset_config.py