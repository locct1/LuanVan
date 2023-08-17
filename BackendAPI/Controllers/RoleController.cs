using BackendAPI.Data;
using BackendAPI.Helpers;
using BackendAPI.Interfaces;
using BackendAPI.Models.Role;
using BackendAPI.Services;
using BackendAPI.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Collections.Generic;
using System.Data;

namespace BackendAPI.Controllers
{
    [Route("api/roles")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly IUnitOfWork _unitOfWork;

        public RoleController(IRoleService roleService, IUnitOfWork unitOfWork)
        {
            _roleService = roleService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet]
        public async Task<IActionResult> GellAllRoles()
        {
            var roles = await _roleService.GetAll();
            return Ok(new Response
            {
                Data = roles,
                Success = true,

            });
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoleById(string id)
        {
            IdentityRole findIdentityRole = await this._roleService.GetRoleById(id);
            if (findIdentityRole is null)
            {
                return BadRequest(new Response
                {
                    Success = false,
                    Errors = new[] { "Không tìm thấy" }

                });
            }
            return Ok(new Response
            {
                Data = findIdentityRole,
                Success = true,

            });

        }
        [HttpPost]
        public async Task<IActionResult> CreateIdentityRole(CreateRoleRequest model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToArray();
                return BadRequest(new Response { Success = false, Errors = errors });
            }
            IdentityRole role = new IdentityRole
            {
                Name = model.Name,
            };
            var result = await _roleService.CreateRole(role);
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetRoleById), new { id = role.Id }, new Response
                {
                    Data = role,
                    Success = true,
                    Message = "Lưu thành công"

                });
            }
            return BadRequest(new Response
            {
                Success = false,
                Errors = result.Errors

            });

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(string id, UpdateRoleRequest model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors)
                                              .Select(e => e.ErrorMessage)
                                              .ToArray();
                return BadRequest(new Response { Success = false, Errors = errors });
            }
            if (id != model.Id)
            {
                return BadRequest();

            }
            IdentityRole findIdentityRole = await _roleService.GetRoleById(id);
            if (findIdentityRole is null)
            {
                return BadRequest(new Response
                {
                    Success = false,
                    Errors = new[] { "Không tìm thấy" }

                });
            }
            findIdentityRole.Name = model.Name;
            var result = await _roleService.UpdateRole(id, findIdentityRole);
            if (result.Success)
            {
                return CreatedAtAction(nameof(GetRoleById), new { id = findIdentityRole.Id }, new Response
                {
                    Data = findIdentityRole,
                    Success = true,
                    Message = "Lưu thành công"

                });
            }
            return BadRequest(new Response
            {
                Success = false,
                Errors = result.Errors

            });

        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdentityRole(string id)
        {
            IdentityRole findRole = await _roleService.GetRoleById(id);
            if (findRole is null)
            {
                return BadRequest(new Response
                {
                    Success = false,
                    Errors = new[] { "Không tìm thấy" }

                });
            }
            await _roleService.DeleteRole(findRole.Id);
            return NoContent();
        }
    }
}
