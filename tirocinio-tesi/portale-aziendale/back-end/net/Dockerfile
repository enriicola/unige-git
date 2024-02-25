FROM mcr.microsoft.com/dotnet/sdk:6.0 AS base

WORKDIR /app
ADD ./ .
RUN dotnet dev-certs https

WORKDIR /app/It.gs.back-end
RUN dotnet restore
RUN dotnet publish -c Release -r linux-x64 -o ./publish

WORKDIR /app/It.gs.back-end/publish
EXPOSE 5007
EXPOSE 5006
ENTRYPOINT ["dotnet", "backend.dll"]
