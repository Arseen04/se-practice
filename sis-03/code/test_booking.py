import unittest
from booking import can_book

NOW = 540
BASE = [(600, 660)]


class BookingTests(unittest.TestCase):
    # ---- the twelve-case set (T1-T11), AC from the brief ----
    def test_touching_end_is_allowed(self):  # T1, AC4
        self.assertIs(can_book(660, 720, NOW, False, BASE), True)

    def test_overlap_is_rejected(self):  # T2, AC4
        self.assertIs(can_book(630, 690, NOW, False, BASE), False)

    def test_blocked_room_is_rejected(self):  # T3, AC3
        self.assertIs(can_book(660, 720, NOW, True, BASE), False)

    def test_exactly_120_minutes_is_allowed(self):  # T4, AC2
        self.assertIs(can_book(720, 840, NOW, False, BASE), True)

    def test_121_minutes_is_rejected(self):  # T5, AC2
        self.assertIs(can_book(720, 841, NOW, False, BASE), False)

    def test_start_equal_to_now_is_rejected(self):  # T6, AC1
        self.assertIs(can_book(540, 570, NOW, False, BASE), False)

    def test_reversed_times_are_rejected(self):  # T7, AC1
        self.assertIs(can_book(720, 660, NOW, False, BASE), False)

    def test_ends_at_midnight_is_allowed(self):  # T8, AC1
        self.assertIs(can_book(1380, 1440, NOW, False, BASE), True)

    def test_past_midnight_is_rejected(self):  # T9, AC1
        self.assertIs(can_book(1380, 1441, NOW, False, BASE), False)

    def test_second_booking_overlap_is_rejected(self):  # T10, AC4
        existing = [(600, 660), (700, 760)]
        self.assertIs(can_book(720, 780, NOW, False, existing), False)

    # ---- AC1: order and bounds ----
    def test_zero_length_request_is_rejected(self):  # AC1: start < end
        self.assertIs(can_book(700, 700, NOW, False, []), False)

    def test_negative_start_is_rejected(self):  # AC1: 0 <= start
        self.assertIs(can_book(-5, 30, -10, False, []), False)

    def test_start_after_day_end_is_rejected(self):  # AC1: end <= 1440
        self.assertIs(can_book(1441, 1450, NOW, False, []), False)

    def test_start_one_minute_after_now_is_allowed(self):  # AC1
        self.assertIs(can_book(541, 600, NOW, False, []), True)

    def test_last_minute_of_day_is_allowed(self):  # AC1
        self.assertIs(can_book(1439, 1440, NOW, False, []), True)

    # ---- AC3: blocked beats everything ----
    def test_blocked_room_rejects_even_with_no_bookings(self):  # AC3
        self.assertIs(can_book(700, 760, NOW, True, []), False)

    # ---- AC4: every kind of overlap, touching on both sides ----
    def test_touching_start_is_allowed(self):  # AC4, other endpoint
        self.assertIs(can_book(541, 600, NOW, False, BASE), True)

    def test_request_inside_booking_is_rejected(self):  # AC4
        self.assertIs(can_book(610, 650, NOW, False, BASE), False)

    def test_request_containing_booking_is_rejected(self):  # AC4
        self.assertIs(can_book(570, 690, NOW, False, BASE), False)

    def test_identical_interval_is_rejected(self):  # AC4
        self.assertIs(can_book(600, 660, NOW, False, BASE), False)

    def test_overlap_on_the_left_is_rejected(self):  # AC4
        self.assertIs(can_book(570, 630, NOW, False, BASE), False)

    def test_last_booking_in_list_is_checked(self):  # AC4
        existing = [(100, 120), (200, 220), (700, 760)]
        self.assertIs(can_book(720, 780, NOW, False, existing), False)

    def test_gap_between_bookings_is_allowed(self):  # AC4
        existing = [(600, 660), (780, 840)]
        self.assertIs(can_book(660, 780, NOW, False, existing), True)

    # ---- AC5: nothing is mutated, result repeats ----
    def test_existing_is_not_changed_and_result_repeats(self):  # T11, AC5
        existing = [(780, 840), (600, 660), (900, 960)]  # deliberately unsorted
        snapshot = list(existing)
        first = can_book(660, 720, NOW, False, existing)
        second = can_book(660, 720, NOW, False, existing)
        self.assertIs(first, True)
        self.assertIs(second, True)
        self.assertEqual(existing, snapshot)

    def test_existing_is_not_changed_when_rejected(self):  # AC5
        existing = [(780, 840), (600, 660), (900, 960)]
        snapshot = list(existing)
        self.assertIs(can_book(630, 690, NOW, False, existing), False)
        self.assertEqual(existing, snapshot)


if __name__ == "__main__":
    unittest.main()
