const API_URL = "https://dev.mykgproxy.webprofy.ru/frontend/";

const openPopupCancel = () => $('.js-popup-cancel').addClass('active');

const openPopupReserved = () => $('.js-popup-reserved').addClass('active');

const openErrorPopup = () => $('.js-popup-error').addClass('active');

const closePopup = (element) => element.closest('.popup').classList.remove('active');

$(window).on('load', () => {

    $('.js-close-popup').on('click', (e) => {
        closePopup(e.currentTarget);
    });

    const handleGetList = (response) => {
        $.ajax({
            url: API_URL,
            type: "POST",
            data: {
                method: 'list',
            },
            contentType: "application/x-www-form-urlencoded",
            success: (response) => {
                response.data.forEach(element => {
                    element.RESERVED === 'N' ?
                        $('.js-table-list').append(`
                        <div class="table reserved">
                        <span>Забронировано</span>
                        <button class="button cancel js-button-order" data-action="cancel" data-index="${element.ID}">Отменить бронь</button>
                        </div>`) :
                        $('.js-table-list').append(`
                        <div class="table open">
                        <span>Свободный стол</span>
                        <button class="button reserved js-button-order" data-action="reserved" data-index="${element.ID}">Забронировать</button>
                        </div>`)
                });
            }
        });
    };

    const handleCancelTable = (response) => {
        if (response.success) {
            openPopupCancel();
        } else {
            openErrorPopup();
        }
    }

    const handleReservedTable = (response) => {
        if (response.success) {
            openPopupReserved();
        } else {
            openErrorPopup();
        }
    }

    handleGetList();

    $(document).on('click', '.js-button-order', function () {
        const typeAction = $(this).data('action');
        if (typeAction === 'cancel') {
            $.ajax({
                url: API_URL,
                type: "POST",
                data: {
                    method: 'cancel',
                    table_id: $(this).data('index'),
                },
                contentType: "application/x-www-form-urlencoded",
                success: handleCancelTable,
                error: openErrorPopup
            });
        };

        if (typeAction === 'reserved') {
            $.ajax({
                url: API_URL,
                type: "POST",
                data: {
                    method: 'reserve',
                    table_id: $(this).data('index'),
                },
                contentType: "application/x-www-form-urlencoded",
                success: handleReservedTable,
                error: openErrorPopup
            });
        };

        if (typeAction === 'update') {
            $('.table').remove();
            handleGetList();
        }
    });
});
