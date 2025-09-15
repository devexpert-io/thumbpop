# Application Architecture Guide

## Introduction

This document outlines the Clean Architecture pattern used in this React application. The primary goal is to create a system that is modular, testable, scalable, and easy to maintain by enforcing a clear separation of concerns.

## Core Principles

- **The Dependency Rule**: Source code dependencies can only point inwards. Nothing in an inner layer can know anything at all about something in an outer layer. For example, Use Cases should not know about React.
- **Separation of Concerns**: Each layer has a distinct and well-defined responsibility.
- **Functional Approach**: Implementation of interfaces should use functions rather than classes to promote simplicity and avoid unnecessary object-oriented complexity.
- **Test-Driven Development**: All new functionality must include comprehensive tests to ensure code quality and prevent regressions.

## Layered Architecture

The architecture is divided into four main layers, from the outermost (UI) to the innermost (Data Sources).

### 1. UI / Framework Layer

- **Location**: `src/components/**`, `src/hooks/**`
- **Responsibility**: Everything related to the user interface and framework specifics.
- **Components (`src/components`)**: These are React components responsible for rendering the UI. They should be as "dumb" as possible, receiving data and callbacks as props.
- **Hooks (`src/hooks`)**: Custom React hooks act as Presenters or Controllers. They handle user interactions, manage UI-related state (`useState`, `useCallback`), and call Use Cases to execute business logic. They should not contain business logic themselves.

### 2. Application Business Logic (Use Cases)

- **Location**: `src/features/*/use-cases/**`
- **Responsibility**: Contains the core application-specific business rules. Each use case represents a single action or feature of the application.
- **Implementation**: Use cases are plain TypeScript functions or objects. They must not have any dependency on React, the UI, or any specific framework.
- **Dependencies**: They receive their dependencies (typically Repository interfaces) via a factory function, enabling dependency injection.

### 3. Repository Layer

- **Location**: `src/features/*/services/**`, `src/features/*/types.ts`
- **Responsibility**: To act as a mediator between the application's use cases and the underlying data sources. They abstract the origin of the data.
- **Repository Interfaces (`IA...Repository`)**: Located in `types.ts`, these define the contract for data access required by the use cases. They belong conceptually to the application layer.
- **Repository Implementations**: The concrete implementation of the repository interface using functional factories (e.g., `createAIRepository`). It orchestrates data from one or more data sources. It depends on Data Source interfaces, not their concrete implementations.

### 4. Data Source Layer

- **Location**: `src/features/*/services/data-sources/**`
- **Responsibility**: Direct interaction with external data providers, such as a REST API, a local database, or browser storage.
- **Data Source Interfaces (`IA...DataSource`)**: Define the contract for a specific data provider.
- **Data Source Implementations**: The concrete implementation that contains the logic for fetching and writing data (e.g., using `fetch`, `@google/genai`, etc.) using functional factories.

## Dependency Injection (DI)

- **Location**: `src/core/di/**`
- **Purpose**: To manage the creation and wiring of services (Repositories, Use Cases, etc.) and provide them to the application.
- **`DIContainer.ts`**: This is where the application's dependency graph is composed. It creates instances of all services, injecting dependencies into them (e.g., passing a repository instance to a use case factory).
- **`ServicesContext.tsx`**: A React Context Provider that makes the DI container available to the entire component tree.
- **`useServices()`**: A custom hook that allows UI hooks and components to easily access the services from the DI container.

## Example Workflow: Enhancing a Thumbnail

1.  **UI (`AIControls.tsx`)**: A user clicks a button, which calls a function from the `useAIGeneration` hook.
2.  **Hook (`useAIGeneration.ts`)**: The hook gets the `enhanceThumbnailUseCase` instance from the DI context via `useServices()` and calls its `execute()` method.
3.  **Use Case (`EnhanceThumbnail.usecase.ts`)**: The use case executes its validation and business logic, then calls the `enhance()` method on the `IAIRepository` interface it holds.
4.  **Repository (`AI.repository.ts`)**: The repository implementation (created with `createAIRepository`) receives the call and delegates it to the `enhance()` method of the `IAIDataSource` interface it holds.
5.  **Data Source (`Gemini.datasource.ts`)**: The data source implementation makes the actual API call to the Google Gemini service.
6.  The result (or error) flows back up the same chain to the UI.

## How to Add a New Feature

Follow these steps to ensure your new feature aligns with the architecture:

1.  **Define Interfaces**: In the relevant feature's `types.ts`, define the contracts for your new Repository (`INewFeatureRepository`) and Data Source (`INewFeatureDataSource`).
2.  **Implement Data Source**: Create the data source implementation in `src/features/new-feature/services/data-sources/` using a functional factory approach (e.g., `createNewFeatureDataSource`).
3.  **Implement Repository**: Create the repository implementation in `src/features/new-feature/services/` using a functional factory approach (e.g., `createNewFeatureRepository`), ensuring it depends on the `INewFeatureDataSource` interface.
4.  **Create Use Case**: Create the use case in `src/features/new-feature/use-cases/`, ensuring it depends on the `INewFeatureRepository` interface.
5.  **Write Tests**: Create comprehensive tests for your new repository, data source, and use case implementations in corresponding `.test.ts` files.
6.  **Wire Dependencies**: In `src/core/di/DIContainer.ts`, create and wire up your new data source, repository, and use case.
7.  **Create UI Hook**: Create a new React hook in `src/hooks/` to manage the feature's state and interaction with the use case.
8.  **Build the UI**: Create your React components, using the new hook to connect the UI to the application logic.