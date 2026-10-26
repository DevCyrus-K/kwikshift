const AppConfig = {
  apiBase: 'https://dashboard.kwikshiftmovers.co.ke/api/v1',
  siteUrl: 'https://www.kwikshiftmovers.co.ke',
  adminUrl: 'https://dashboard.kwikshiftmovers.co.ke',
  cloudinaryCloud: 'dqqf1uilk',
  resolvImageUrl: function(item) {
    if (item.image_url && item.image_url.startsWith('http')) {
      return item.image_url;
    }
    if (item.storage_url && item.storage_url.startsWith('http')) {
      return item.storage_url;
    }
    if (item.thumbnail_url && item.thumbnail_url.startsWith('http')) {
      return item.thumbnail_url;
    }
    if (item.image_path) {
      return 'https://www.kwikshiftmovers.co.ke/' + item.image_path;
    }
    return 'https://www.kwikshiftmovers.co.ke/assets/img/placeholder.jpg';
  }
};
