import { ONE_DAY, ONE_HOUR, ONE_MINUTE } from '@/common';

function format(
  date: string,
  formats?: string,
  options: { format?: 'iso' | 'utc' | 'locale'; dateOnly?: boolean } = {
    format: 'locale',
    dateOnly: true
  }
) {
  const dateObj = new Date(date);
  const options1: any = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const options2: any = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  };

  let newDate: string = '';

  switch (formats) {
    case 'L':
      newDate = options.dateOnly
        ? dateObj.toLocaleDateString('vi-VN', options1)
        : dateObj.toLocaleString();
      break;
    case 'LL':
      newDate = dateObj
        .toLocaleDateString('vi-VN', options2)
        .replace(',', ' năm');
      break;
    case 'LLL':
      newDate =
        dateObj.toLocaleDateString('vi-VN', options2).replace(',', ' năm') +
        ', lúc ' +
        dateObj.toLocaleTimeString('vi-VN').split(':')[0] +
        ':' +
        dateObj.toLocaleTimeString('vi-VN').split(':')[1];
      break;
    default:
      newDate = options.dateOnly
        ? dateObj.toLocaleDateString('vi-VN', options1)
        : dateObj.toLocaleString();
      break;
  }

  return newDate;
}

function fromNow(
  date: string,
  options?: {
    onlyDay: boolean | false;
  }
) {
  const dateObj = new Date(date);
  const now = new Date();

  const diff = now.getTime() - dateObj.getTime();
  const diffDays = diff / ONE_DAY;

  let fromNowStr: string = '';

  if (options?.onlyDay) {
    if (diffDays < 30) {
      if (diffDays < 1) {
        fromNowStr = 'Hôm nay';
      } else if (Math.round(diffDays) == 1) {
        fromNowStr = 'Hôm qua';
      } else {
        fromNowStr = Math.round(diffDays) + ' ngày trước';
      }
    } else {
      if (diffDays < 365) {
        fromNowStr = Math.round(diffDays / 30) + ' tháng trước';
      } else {
        fromNowStr = Math.round(diffDays / 365) + ' nắm trước';
      }
    }
  } else {
    if (diffDays >= 1) {
      if (diffDays < 30) {
        fromNowStr = Math.round(diffDays) + ' ngày trước';
      } else {
        if (diffDays < 365) {
          fromNowStr = Math.round(diffDays / 30) + ' tháng trước';
        } else {
          fromNowStr = Math.round(diffDays / 365) + ' nắm trước';
        }
      }
    } else {
      const diffHours = diff / ONE_HOUR;

      if (diffHours > 1) {
        fromNowStr = Math.round(diffHours) + ' giờ trước';
      } else {
        const diffMinutes = Math.round(diff / ONE_MINUTE);

        if (diffMinutes > 1) {
          fromNowStr = Math.round(diffMinutes) + ' phút trước';
        } else {
          // const diffSeconds = Math.round(diff / ONE_SECOND);

          // fromNowStr = Math.round(diffSeconds) + ' giây trước';

          fromNowStr = 'Vài giây trước';
        }
      }
    }
  }

  return fromNowStr;
}

function toNow(
  releaseTime: string,
  runtime: number
): { status: string; message: string } {
  // const releaseTime = '2024-12-15T20:23:33';
  const releaseDateTime = new Date(releaseTime).getTime();
  // + new Date(releaseTime).getTimezoneOffset() * 60 * 1000;
  const now = new Date().getTime();
  const runtimeMs = runtime * 1000;

  const obj = {
    status: '',
    message: ''
  };

  if (releaseDateTime > now) {
    const diffMs = releaseDateTime - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays >= 1) {
      obj.status = 'not-yet';
      obj.message = `Công chiếu sau ${diffDays} ngày ${diffHours} giờ nữa`;
    } else if (diffHours >= 1) {
      obj.status = 'not-yet';
      obj.message = `Công chiếu sau ${diffHours} giờ ${diffMinutes} phút nữa`;
    } else {
      obj.status = 'not-yet';
      // obj.message = 'Sắp công chiếu!'; // Nếu còn dưới 1 giờ
      obj.message = `Công chiếu sau ${diffMinutes} phút ${diffMinutes} giây nữa`;
    }
  } else {
    const diffMs = now - releaseDateTime;

    if (diffMs < runtimeMs) {
      obj.status = 'playing';
      obj.message = 'Đang công chiếu!';
    } else {
      obj.status = 'ended';
      obj.message = 'Đã kết thúc!';
    }
  }

  return obj;
}

function convertSeconds(seconds: number) {
  if (!seconds) {
    return '0 giây';
  }

  if (seconds < 60) {
    return `${seconds} giây`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes} phút ${secs > 0 ? secs + ' giây' : ''}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours} giờ ${minutes > 0 ? minutes + ' phút ' : ''}${secs > 0 ? secs + ' giây' : ''}`;
  }
}

export const dateTimeFormater = () => {
  return { format, fromNow, toNow, convertSeconds };
};
