# building with gradle and storing in the image ...
#FROM gradle:6.6.1-jdk11-alpine AS build
#FROM gradle:6.0.0-jdk8-alpine AS build

FROM adoptopenjdk:11-jdk-hotspot AS build

CMD ["gradle"]

ENV GRADLE_HOME /opt/gradle

RUN set -o errexit -o nounset \
    && echo "Adding gradle user and group" \
    && groupadd --system --gid 1000 gradle \
    && useradd --system --gid gradle --uid 1000 --shell /bin/bash --create-home gradle \
    && mkdir /home/gradle/.gradle \
    && chown --recursive gradle:gradle /home/gradle \
    \
    && echo "Symlinking root Gradle cache to gradle Gradle cache" \
    && ln -s /home/gradle/.gradle /root/.gradle

VOLUME /home/gradle/.gradle

WORKDIR /home/gradle

RUN apt-get update \
    && apt-get install --yes --no-install-recommends \
        fontconfig \
        unzip \
        wget \
        \
        bzr \
        git \
        git-lfs \
        mercurial \
        openssh-client \
        subversion \
    && rm -rf /var/lib/apt/lists/*

ENV GRADLE_VERSION 6.6.1
ARG GRADLE_DOWNLOAD_SHA256=7873ed5287f47ca03549ab8dcb6dc877ac7f0e3d7b1eb12685161d10080910ac
RUN set -o errexit -o nounset \
    && echo "Downloading Gradle" \
    && wget --no-verbose --output-document=gradle.zip "https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip" \
    \
    && echo "Checking download hash" \
    && echo "${GRADLE_DOWNLOAD_SHA256} *gradle.zip" | sha256sum --check - \
    \
    && echo "Installing Gradle" \
    && unzip gradle.zip \
    && rm gradle.zip \
    && mv "gradle-${GRADLE_VERSION}" "${GRADLE_HOME}/" \
    && ln --symbolic "${GRADLE_HOME}/bin/gradle" /usr/bin/gradle \
    \
    && echo "Testing Gradle installation" \
    && gradle --version

COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle build --no-daemon



# run the built after descarding the gradle image and running it with a java  image instead ...
FROM adoptopenjdk/openjdk11-openj9:x86_64-debian-jdk-11.0.5_10_openj9-0.17.0
MAINTAINER http://www.uv.es/twcam

COPY opencv-install.sh opencv-install.sh
#COPY build/libs/*.jar app.jar
RUN chmod +x opencv-install.sh && sync && ./opencv-install.sh
LABEL maintainer="spring"
EXPOSE 8080
USER app
RUN mkdir /home/app2
COPY --from=build /home/gradle/src/build/libs/*.jar /home/app2/spring-boot-application.jar
CMD bash
#ADD target/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-XX:+UnlockExperimentalVMOptions", "-XX:+UseCGroupMemoryLimitForHeap", "-Djava.security.egd=file:/dev/./urandom","-jar","/home/app2/spring-boot-application.jar"]
#ENTRYPOINT ["java","-jar","/app.jar"]
