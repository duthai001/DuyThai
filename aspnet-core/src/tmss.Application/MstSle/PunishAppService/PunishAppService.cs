using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using tmss.MstSle.IPunishAppService.Dto;
using System.Linq;
using Abp.Linq.Extensions;
using Stripe.Terminal;

namespace tmss.MstSle.PunishAppServices
{
    public class PunishAppService : tmssAppServiceBase, IApplicationService
    {
        private readonly IRepository<Punish, long> _punish;
        private readonly IRepository<Readers, long> _readers;
        private readonly IRepository<BorrowBook, long> _borrowBook;
        private readonly IRepository<ReturnBook, long> _returnBook;
        private readonly IRepository<Situation, long> _situation;
        public PunishAppService(
IRepository<Punish, long> punish
, IRepository<Readers, long> readers, IRepository<BorrowBook, long> borrowBook, IRepository<ReturnBook, long> returnBook, IRepository<Situation, long> situation)
        {
            _punish = punish;
            _readers = readers;
            _borrowBook = borrowBook;
            _returnBook = returnBook;
            _situation = situation;
        }

        public async Task<PagedResultDto<GetAllPunishForViewDto>> GetAll(GetAllPunishForInputDto input)
        {
            var query = from punish in _punish.GetAll().AsNoTracking()

                        join reader in _readers.GetAll().AsNoTracking()
                        on punish.ReaderId equals reader.Id
                        into readers
                        from reader in readers.DefaultIfEmpty()

                        join borrow in _borrowBook.GetAll().AsNoTracking()
                        on punish.BorrowBookId equals borrow.Id
                         into borrows
                        from borrow in borrows.DefaultIfEmpty()

                        join re in _returnBook.GetAll().AsNoTracking()
                        on punish.ReturnBookId equals re.Id
                         into res
                        from re in res.DefaultIfEmpty()

                        join si in _situation.GetAll().AsNoTracking()
                        on punish.IsStatus equals si.Id
                            into sis
                        from si in sis.DefaultIfEmpty()

                        select new GetAllPunishForViewDto
                        {
                            Id = punish.Id,
                            Reader = reader.Name,
                            ReaderNo = reader.ReaderNo,
                            BorrowNo = borrow.BorrowNo,
                            ReturnNo = re.ReturnNo,
                            PunisnhMoney = punish.PunisnhMoney,
                            Status = si.PunishmentReason
                            
                        };
            var totalCount = await query.CountAsync();
            var pagedAndFiltered = query.PageBy(input);

            return new PagedResultDto<GetAllPunishForViewDto>(
                totalCount,
                await pagedAndFiltered.ToListAsync()
            );
        }
    }
}
