using Application.Common.Behaviours;
using Application.Common.Interfaces;
using Application.TaskLists.Commands.CreateTaskList;
using Application.TaskLists.Commands.UpdateTaskList;
using Application.TaskLists.Dto;
using Application.TaskLists.Queries.GetTaskList;
using Application.TaskLists.Queries.GetUserTaskLists;
using Application.Tasks.Commands.ClearCompletedTasks;
using Application.Tasks.Commands.CreateTask;
using Application.Tasks.Commands.UpdateTaskStatus;
using Application.Tasks.Dto;
using Application.Tasks.Queries.GetTask;
using Application.Tasks.Queries.GetTasksByState;
using Application.Tasks.Queries.GetTaskSummary;
using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Application
{
    [ExcludeFromCodeCoverage]
    public static class ApplicationServiceConfiguration
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

            // Register new command and query handlers
            services.AddTransient<IRequestHandler<CreateTaskListCommand, TaskListDto>, CreateTaskListCommandHandler>();
            services.AddTransient<IRequestHandler<CreateTaskCommand, TaskDto>, CreateTaskCommandHandler>();
            services.AddTransient<IRequestHandler<UpdateTaskStatusCommand>, UpdateTaskStatusCommandHandler>();
            services.AddTransient<IRequestHandler<GetTaskSummaryQuery, TaskSummaryDto>, GetTaskSummaryQueryHandler>();
            services.AddTransient<IRequestHandler<ClearCompletedTasksCommand>, ClearCompletedTasksCommandHandler>();
            services.AddTransient<IRequestHandler<GetTasksByStateQuery, List<TaskDto>>, GetTasksByStateQueryHandler>();
            services.AddTransient<IRequestHandler<GetTaskQuery, TaskDto>, GetTaskQueryHandler>();
            services.AddTransient<IRequestHandler<GetTaskListQuery, TaskListDto>, GetTaskListQueryHandler>();
            services.AddTransient<IRequestHandler<UpdateTaskListCommand, TaskListDto>, UpdateTaskListCommandHandler>();
            services.AddTransient<IRequestHandler<GetUserTaskListsQuery, List<TaskListDto>>, GetUserTaskListsQueryHandler>();

            services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

        }
    }
}