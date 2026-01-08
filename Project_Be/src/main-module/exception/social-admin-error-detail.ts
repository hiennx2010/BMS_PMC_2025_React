import { GeneralResponseErrorDetail, GeneralResponseTemp, ResponseCode } from "src/common-module/dto/general-response.dto";

export class SocialAdminErrorDetail extends GeneralResponseErrorDetail {
    // Nhóm lỗi xác thực (1xxx)
    static readonly INVALID_USERNAME_OR_PASSWORD: GeneralResponseTemp = { errorCode: '1101', message: 'Email đăng nhập hoặc mật khẩu của bạn không khớp. Vui lòng thử lại.', code: ResponseCode.ERROR }
    static readonly USER_NOT_VALIDATED: GeneralResponseTemp = { errorCode: '1100', message: 'User chưa được xác nhận', code: ResponseCode.ERROR }

    // Nhóm lỗi Validate đăng ký user (2xxx)
    static readonly INVALID_EMAIL_FORMAT: GeneralResponseTemp = { errorCode: '2001', message: 'Email của bạn không hợp lệ', code: ResponseCode.ERROR }
    static readonly PHONE_NUMBER_LENGTH_ERROR: GeneralResponseTemp = { errorCode: '2002', message: 'Số điện thoại của bạn không hợp lệ', code: ResponseCode.ERROR }
    static readonly PASSWORD_LENGTH_ERROR: GeneralResponseTemp = { errorCode: '2003', message: 'Mật khẩu phải có ít nhất 8 ký tự và không chứa khoảng trắng', code: ResponseCode.ERROR }
    static readonly DUPLICATE_EMAIL_ERROR: GeneralResponseTemp = { errorCode: '2004', message: 'Email của bạn đã được sử dụng', code: ResponseCode.ERROR }
    static readonly INVALID_DOB_ERROR: GeneralResponseTemp = { errorCode: '2005', message: 'Ngày sinh của bạn không được lớn hơn ngày hiện tại', code: ResponseCode.ERROR }
    static readonly TEMPLATE_NOT_FOUND: GeneralResponseTemp = { errorCode: '2006', message: 'Không tìm thấy template', code: ResponseCode.ERROR }
    static readonly TOKEN_INVALID: GeneralResponseTemp = { errorCode: '2007', message: 'Token hết hạn hoặc không hợp lệ', code: ResponseCode.ERROR }

    // Nhóm lỗi Nghiệp vụ (3xxx) 
    // private dữ liệu
    static readonly PRIVATE_PROFILE_ERROR: GeneralResponseTemp = { errorCode: '3000', message: 'Người dùng đang ẩn thông tin tài khoản với người khác', code: ResponseCode.ERROR }
    static readonly PRIVATE_POST_ERROR: GeneralResponseTemp = { errorCode: '3001', message: 'Người dùng đang ẩn danh sách bài viết đã đăng với người khác', code: ResponseCode.ERROR }
    static readonly PRIVATE_FOLLOWING_ERROR: GeneralResponseTemp = { errorCode: '3002', message: 'Người dùng đang ẩn danh sách đang theo dõi với người khác', code: ResponseCode.ERROR }
    static readonly PRIVATE_FOLLOWER_ERROR: GeneralResponseTemp = { errorCode: '3003', message: 'Người dùng đang ẩn danh sách người theo dõi với người khác', code: ResponseCode.ERROR }
    static readonly PRIVATE_ROOM_ERROR: GeneralResponseTemp = { errorCode: '3004', message: 'Người dùng đang ẩn danh sách hội nhóm với người khác', code: ResponseCode.ERROR }
    static readonly USER_NOT_FOUND: GeneralResponseTemp = { errorCode: '3005', message: 'Người dùng không tồn tại hoặc đã bị xóa', code: ResponseCode.ERROR }
    static readonly USER_ALREADY_VERIFIED: GeneralResponseTemp = { errorCode: '3006', message: 'Người dùng đã được xác thực rồi.', code: ResponseCode.ERROR }
    static readonly TOO_MANY_EMAIL_AUTH_ATTEMPTS: GeneralResponseTemp = { errorCode: '3007', message: 'Vượt quá số lần gửi email xác thực', code: ResponseCode.ERROR }
    static readonly UNVERIFIED_USER: GeneralResponseTemp = { errorCode: '3008', message: 'Người dùng chưa được xác thực', code: ResponseCode.ERROR }
    static readonly DATA_NOT_CHANGE: GeneralResponseTemp = { errorCode: '3009', message: 'Dữ liệu không có sự cập nhật', code: ResponseCode.ERROR }
    static readonly BAD_WORD_CATEGORY_NOT_FOUND: GeneralResponseTemp = { errorCode: '3010', message: 'Chưa khai báo danh mục từ cấm', code: ResponseCode.ERROR }
    static readonly DATA_INVALID: GeneralResponseTemp = { errorCode: '3011', message: 'Dữ liệu không hợp lệ', code: ResponseCode.ERROR }
    static readonly FILE_TYPE_INVALID: GeneralResponseTemp = { errorCode: '3012', message: 'Định dạng file không hợp lệ', code: ResponseCode.ERROR }
    static readonly FILE_SIZE_INVALID: GeneralResponseTemp = { errorCode: '3013', message: 'File quá giới hạn dung lượng', code: ResponseCode.ERROR }

    // Nhóm lỗi Bài viết vi phạm (4xxx)
    static readonly POST_REPORT_NOT_FOUND: GeneralResponseTemp = { errorCode: '4000', message: 'Không tìm thấy dữ liệu!', code: ResponseCode.ERROR }

}
