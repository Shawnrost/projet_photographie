from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class PaginationStandard(PageNumberPagination):
    """
    Pagination utilisée sur tous les endpoints liste du projet.
    Paramètres URL : ?page=2&page_size=20
    """
    page_size = 12                   # Défaut : 12 éléments par page
    page_size_query_param = "page_size"
    max_page_size = 50
    page_query_param = "page"

    def get_paginated_response(self, data):
        return Response({
            "success": True,
            "pagination": {
                "total":        self.page.paginator.count,
                "pages":        self.page.paginator.num_pages,
                "page_actuelle": self.page.number,
                "page_size":    self.get_page_size(self.request),
                "suivante":     self.get_next_link(),
                "precedente":   self.get_previous_link(),
            },
            "data": data,
        })