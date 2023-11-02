using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Helpers.Mail;
using BackendAPI.Interfaces;
using BackendAPI.Interfaces.Client;
using BackendAPI.Services;
using BackendAPI.Services.Client;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using AutoMapper;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
//builder.Services.AddControllers().AddJsonOptions(x =>
//                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles).ConfigureApiBehaviorOptions(options =>
//                {
//                    options.SuppressModelStateInvalidFilter = false;
//                });

//builder.Services

builder.Services.AddDbContext<ApplicationContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("SQLServer"));
});
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationContext>().AddDefaultTokenProviders().AddErrorDescriber<CustomIdentityErrorDescriber>(); ;
builder.Services.AddOptions();                                        // Kích hoạt Options
builder.Services.Configure<MailSettings>(
    builder.Configuration.GetSection("MailSettings"));
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddTransient<IEmailSender, SendMailService>();       // Đăng ký dịch vụ Mail

builder.Services.AddUnitOfWork<ApplicationContext>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IWareHouseService, WareHouseService>();
builder.Services.AddScoped<IColorProductService, ColorProductService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductSampleService, ProductSampleService>();
builder.Services.AddTransient<IGetValueToken, GetValueToken>();
builder.Services.AddScoped<IAdminAccountService, AdminAccountService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IProductPurchaseOrderService, ProductPurchaseOrderService>();
builder.Services.AddScoped<IProductPurchaseOrderDetailService, ProductPurchaseOrderDetailService>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddScoped<IPageService, PageService>();
builder.Services.AddScoped<IClientAccountService, ClientAccountService>();
builder.Services.AddScoped<IPaymentMethodService, PaymentMethodService>();
builder.Services.AddScoped<IRecipientService, RecipientService>();
builder.Services.AddScoped<IProductVersionService, ProductVersionService>();
builder.Services.AddScoped<IProductColorProductService, ProductColorProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPromotionProductService, PromotionProductService>();
builder.Services.AddScoped<IPromotionProductDetailService, PromotionProductDetailService>();
builder.Services.AddScoped<IReviewProductService, ReviewProductService>();
builder.Services.AddScoped<IReviewProductPhotoService, ReviewProductPhotoService>();
builder.Services.AddScoped<ILikeReviewProductService, LikeReviewProductService>();
builder.Services.AddScoped<IFeedbackReviewProductService, FeedbackReviewProductService>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddScoped<IVnPayClientService, VnPayClientService>();
builder.Services.AddScoped<IManageAccountService, ManageAccountService>();
builder.Services.AddScoped<IProductCategoryService, ProductCategoryService>();

builder.Services.AddScoped<IShockDealService, ShockDealService>();

builder.Services.AddScoped<IShockDealDetailService, ShockDealDetailService>();

builder.Services.AddScoped<IAdminDashBoardService, AdminDashBoardSerivce>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:ValidAudience"],
        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
    };
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(
    builder =>
    {
        builder.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    }
    );
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
           Path.Combine(builder.Environment.ContentRootPath, "Uploads")),
    RequestPath = "/Uploads"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
