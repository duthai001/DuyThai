using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.MstSleTypeOfBook.Dto;
using tmss.MstSle.MstSleTypeOfCard.Dto;

namespace tmss.MstSle.MstSleTypeOfCard
{
    public class MstSleTypeOfCardAppService : tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<TypeOfCard, long> _typeCard;
        public MstSleTypeOfCardAppService(IRepository<TypeOfCard, long> typeCard)
        {
            _typeCard = typeCard;
        }
        public async Task<PagedResultDto<GetTypeOfCardForView>> GetAllTypeCard(GetTypeOfCardForInput input)
        {
            var query = from typecard in _typeCard.GetAll().AsNoTracking()
                       .Where(e => string.IsNullOrWhiteSpace(input.TypeCardName) || e.NameCard.Contains(input.TypeCardName))
                        select new GetTypeOfCardForView
                        {
                           Id=typecard.Id,
                            NameCard=typecard.NameCard,
                            Rate=typecard.Rate,
                            CardAmount=typecard.CardAmount,
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);
            return new PagedResultDto<GetTypeOfCardForView>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
                );
        }
        public async Task CreateOrEditCardType(CreateOrEditTypeCard input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }
        }
        protected virtual async Task Create(CreateOrEditTypeCard input)
        {
            var mstSleTypeCard = ObjectMapper.Map<TypeOfCard>(input);
            await _typeCard.InsertAsync(mstSleTypeCard);
        }
        protected virtual async Task Update(CreateOrEditTypeCard input)
        {
            var mstSleTypeCard = await _typeCard.FirstOrDefaultAsync((long)input.Id);
            ObjectMapper.Map(input, mstSleTypeCard);
        }
        public async Task DeleteCardType(EntityDto<long> input)
        {
            var mstSleTypeCard = await _typeCard.FirstOrDefaultAsync(e => e.Id == input.Id);
            await _typeCard.DeleteAsync(mstSleTypeCard);
        }
        public async Task<GetMstSleTypeCardValueForEditOutput> GetTypeCardForEdit(EntityDto<long> input)
        {
            var mstSleTypeCard = await _typeCard.FirstOrDefaultAsync(input.Id);
            var output = new GetMstSleTypeCardValueForEditOutput
            {
                CreateOrEditTypeCardValue = ObjectMapper.Map<CreateOrEditTypeCard>(mstSleTypeCard)
            };
            return output;
        }
    }
}
