# ---------- Build Stage ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["UserManagementAPI.csproj", "./"]
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Publish the application
RUN dotnet publish -c Release -o /app/publish


# ---------- Runtime Stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published files from build stage
COPY --from=build /app/publish .

# Set ASP.NET to listen on port 4000
ENV ASPNETCORE_URLS=http://+:4000

# Expose port
EXPOSE 4000

# Run the application
ENTRYPOINT ["dotnet", "UserManagementAPI.dll"]